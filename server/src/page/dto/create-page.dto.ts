/**
 * DTO для создания новой страницы
 */
export class CreatePageDto {
    /**
     * Заголовок страницы
     */
    title: string;
    
    /**
     * Содержимое страницы
     */
    content: string;
}
