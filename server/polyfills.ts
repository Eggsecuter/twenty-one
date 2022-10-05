interface Array<T> {
    remove(item: T): void;
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function(item) {
        this.splice(this.indexOf(item), 1);
    }
}
