export function createConstantArray(...elements) {
  // create array with predefined properties 0, 1, 2, n...
  const array = new Array(elements.length);
  for (let index = 0; index < elements.length; index++) {
    // typeof array === 'object' =D so,
    // Assign each elements as enumerable non-writable
    Object.defineProperty(array, index, {
      configurable: false, writable: false, enumerable: true,
      value: elements[index]
    });
  }
  return array;
};