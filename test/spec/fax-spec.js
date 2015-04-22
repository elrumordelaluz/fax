describe('fax', function () {

  function createTestDOM(num){
    var testElem = document.createElement('section');
    testElem.className = 'test-section';
    testElem.id = 'test' + num;
    var testChild = document.createElement('div');
    testChild.className = 'test-div';
    testElem.appendChild(testChild);
    document.body.appendChild(testElem);
  }

  describe('toObject', function () {

    var faxObj;

    beforeEach(function () {
      createTestDOM('1');
      faxObj = fax.toObject('#test1');
    });

    it('should loop into and return a new Object', function () {
      expect(Object.prototype.toString.call(faxObj)).toBe('[object Object]');
    });

    it('should generate attributes values from element', function () {
      expect(faxObj['attrs']['id']).toBe('test1');
    });

  });


});
