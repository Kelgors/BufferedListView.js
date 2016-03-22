class Pool {
  constructor(ObjectContructor, size, initSize = size) {
    this.size = size;
    this.ObjectContructor = ObjectContructor;
    this.borrowedObjects = [];
    this.availableObjects = [];
  }

  destroy() {
    this.borrowedObjects = null;
    this.availableObjects = [];
    this.ObjectContructor = null;
  }

  borrows() {
    let object = null;
    if (this.hasAvailables()) {
      if (this.availableObjects.length === 0) {
        object = new this.ObjectContructor();
      } else {
        object = this.availableObjects.pop();
      }
      this.borrowedObjects.push(object);
    }
    return object;
  }

  returns(borrowedObject) {
    if (!(borrowedObject instanceof this.ObjectContructor)) {
      throw new Error(`Can't return object which is not a ${this.ObjectConstructor.name}`);
    }
    const index = this.borrowedObjects.indexOf(borrowedObject);
    if (index === -1) {
      if (this.availableObjects.includes(borrowedObject)) {
        throw new Error(`${this.ObjectContructor.name} already returned !`);
      } else {
        throw new Error(`Object given in Pool#returns() is not referenced in this Pool instance.`);
      }
    }
    this.borrowedObjects.splice(index, 1);
    try {
      borrowedObject.dispose();
    } catch (err) {
    } finally {
      //console.log('finally');
      this.availableObjects.push(borrowedObject);
    }

  }

  hasAvailables() {
    return this.size === -1 || this.borrowedObjects.length < this.size;
  }

  getCountAvailables() {
    return this.availableObjects.length;
  }

  getCountBorrowed() {
    return this.borrowedObjects.length;
  }

}