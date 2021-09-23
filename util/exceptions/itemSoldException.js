function ItemAlreadySoldException() {
    this.message = "Item is already sold";
    this.name = "ItemAlreadySoldException";
}

module.exports = { ItemAlreadySoldException };