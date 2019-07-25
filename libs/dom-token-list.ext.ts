export { }

/**
 * Adiciona o suporte ao metodo indexOf no tipo DOMTokenList, o mesmo tipo de uma ClassList
 */
declare global {
    interface DOMTokenList {
        indexOf(class_name: string): number;
    }
}

/**
 * Retorna o index da classe no array de classes
 *
 * @param _element
 */
DOMTokenList.prototype.indexOf = function (_element: string): number {
    return Array.from(this).indexOf(_element);
};
