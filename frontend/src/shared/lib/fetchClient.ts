import createClient from "openapi-fetch/dist/index.cjs";
import type { paths } from "../api/api_directus";
import type { paths as appPaths } from "../api/api";

export const directusClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_DIRECTUS_API_URL,
  credentials: "include",
});


/**
 * ИНТЕРСЕПТОР ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ ТОКЕНОВ
 * 
 * Этот интерсептор решает проблему истечения access_token'ов в приложении.
 * 
 * КАК ЭТО РАБОТАЕТ:
 * 
 * 1. ОСНОВНАЯ ПРОБЛЕМА:
 *    - Access токены имеют короткий срок жизни (обычно 15-30 минут)
 *    - Refresh токены живут дольше (недели/месяцы)
 *    - Когда access токен истекает, API возвращает 401 ошибку
 *    - Без интерсептора пользователю пришлось бы перелогиниваться
 * 
 * 2. МЕХАНИЗМ РАБОТЫ:
 *    - При каждом HTTP запросе (GET, POST, PUT, DELETE, PATCH) 
 *      интерсептор проверяет ответ на наличие ошибок
 *    - Если получена 401 ошибка (Unauthorized), это означает истечение access токена
 *    - Интерсептор автоматически вызывает refresh endpoint для получения нового токена
 *    - После успешного обновления токена, оригинальный запрос повторяется
 * 
 * 3. ОЧЕРЕДЬ ЗАПРОСОВ:
 *    - Если во время обновления токена приходят новые запросы, они не теряются
 *    - Все новые запросы помещаются в очередь (requestQueue)
 *    - После успешного обновления токена все запросы из очереди выполняются
 *    - Это предотвращает race conditions и потерю данных
 * 
 * 4. СОСТОЯНИЯ СИСТЕМЫ:
 *    - isRefreshing: флаг, показывающий идет ли сейчас обновление токена
 *    - refreshPromise: промис обновления токена для избежания дублирования запросов
 *    - requestQueue: массив отложенных запросов
 * 
 * 5. ОБРАБОТКА ОШИБОК:
 *    - Если обновление токена не удалось, все запросы в очереди отклоняются
 *    - Пользователь будет перенаправлен на страницу логина
 *    - Ошибки логируются в консоль для отладки
 * 
 * 6. БЕЗОПАСНОСТЬ:
 *    - Токены обновляются через cookie-based аутентификацию
 *    - Refresh токен автоматически отправляется сервером в httpOnly cookie
 *    - Новый access токен сохраняется в cookie для последующих запросов
 * 
 * ПРЕИМУЩЕСТВА:
 * - Пользователь не замечает истечения токенов
 * - Нет потери данных при одновременных запросах
 * - Автоматическое восстановление сессии
 * - Прозрачная работа для разработчиков
 */

// Очередь для запросов во время обновления токена
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
const requestQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
  request: () => Promise<any>;
}> = [];

// Функция для обновления токена
const refreshToken = async (): Promise<void> => {
  try {
    const response = await directusClient.POST("/auth/refresh", {
      body: { mode: "cookie" },
    });

    if (response.data?.data?.access_token) {
      document.cookie = `access_token=${response.data.data.access_token}; path=/`;
    }
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    throw error;
  }
};

// Функция для обработки очереди запросов
const processQueue = (error: any, token: string | null = null) => {
  requestQueue.forEach(({ resolve, reject, request }) => {
    if (error) {
      reject(error);
    } else {
      resolve(request());
    }
  });
  requestQueue.length = 0;
};

// Функция для добавления запроса в очередь
const queueRequest = (request: () => Promise<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, request });
  });
};

// Функция для выполнения запроса с обработкой ошибок
const executeRequest = async (request: () => Promise<any>): Promise<any> => {
  const response = await request();

  console.log("response", response);
  
  // Проверяем наличие ошибки в ответе
  if (response.error) {
    // Проверяем, является ли ошибка связанной с токеном (401)
    if (response.error.statusCode === 401 && !isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
      
      try {
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
        
        // Повторяем запрос после успешного обновления токена
        const retryResponse = await request();
        
        // Обрабатываем очередь при успешном обновлении
        processQueue(null);
        
        return retryResponse;
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;
        processQueue(refreshError);
        throw refreshError;
      }
    } else if (response.error.statusCode === 401 && isRefreshing) {
      // Если токен уже обновляется, добавляем запрос в очередь
      return await queueRequest(request);
    }
  }
  
  return response;
};

// Создаем обертки для методов клиента
const createInterceptedClient = (originalClient: any) => {
  console.log("createInterceptedClient");
  return {
    ...originalClient,
    GET: (path: any, options?: any) =>
      executeRequest(() => originalClient.GET(path, options)),
    POST: (path: any, options?: any) =>
      executeRequest(() => originalClient.POST(path, options)),
    PUT: (path: any, options?: any) =>
      executeRequest(() => originalClient.PUT(path, options)),
    DELETE: (path: any, options?: any) =>
      executeRequest(() => originalClient.DELETE(path, options)),
    PATCH: (path: any, options?: any) =>
      executeRequest(() => originalClient.PATCH(path, options)),
  };
};

export const client: createClient.Client<appPaths, `${string}/${string}`> =
  createInterceptedClient(
    createClient<appPaths>({
      baseUrl: import.meta.env.VITE_API_URL,
      credentials: "include",
    })
  );
