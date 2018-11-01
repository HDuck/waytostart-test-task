(function formSelect() {
    var input = document.querySelector('.form-select');
    var dummy = document.querySelector('.form-select__dummy-inp');
    var items = document.getElementsByClassName('form-select__item');
    var list = document.querySelector('.form-select__list');

    dummy.addEventListener('click', openList, false);
    document.addEventListener('click', closeList, false);
    
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', setInpVal, false);
        items[i].addEventListener('touchend', setInpVal, false);
    }

    function openList(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (!list.classList[1]) {
            list.className += ' form-select__list_visible';
        }
    }

    function closeList() {
        list.className = 'form-select__list';
    }

    function setInpVal(evt) {
        var itemTxt = evt.currentTarget.children[0].textContent;
        
        input.value = itemTxt;
        dummy.textContent = itemTxt;
        closeList();
    }

})();