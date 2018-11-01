(function vehicleForm() {
    var inputs = document.getElementsByClassName('vehicle-form__input');
    var radioInps = document.querySelectorAll('.vehicle-form__radio > .vehicle-form__input');
    var submit = document.querySelector('.vehicle-form__submit');
    var selectInp = document.querySelector('.form-select');
    var tableCont = document.querySelector('.table__content');
    var radioArr = Array.prototype.slice.call(radioInps, 0);
    var inputsArr = Array.prototype.slice.call(inputs, 0);

    inputsArr.forEach(function (item) {
        item.addEventListener('input', toggleLabel, false);
    });

    submit.addEventListener('click', addTableElement, false);

    function toggleLabel(evt) {
        var input = evt.target;
        var radioWrapper = evt.target.parentElement;
        var label;
        
        if (input.type === 'text') {
            label = input.previousElementSibling

            if (input.value) label.style.opacity = 1;
            else label.style.opacity = 0;

        } else if (input.type === 'radio') {
            label = radioWrapper.parentElement.children[0];
            
            if (input.value) label.style.opacity = 1;
            else label.style.opacity = 0;
            
            selectRadio(radioWrapper);
        }
    }

    function selectRadio(targetRadio) {
        var targetId = targetRadio.getAttribute('data-id');
        var itemId;

        radioArr.forEach(function (item) {
            itemId = item.parentElement.getAttribute('data-id');

            if (itemId === targetId) item.parentElement.className = 'vehicle-form__radio vehicle-form__radio_checked';
            else item.parentElement.className = 'vehicle-form__radio';
        });
    }

    function addTableElement(evt) {
        evt.preventDefault();
        var values = [];

        inputsArr.forEach(function(item) {

            if (item.type === 'radio' && item.checked) values.push(item.parentElement.getAttribute('data-id'));
            else if (item.type === 'text') values.push(item.value);
        });

        values.push(selectInp.value);

        var tableRow = document.createElement('div');
        tableRow.className = 'table__row';

        var rowName = document.createElement('div');
        rowName.innerHTML = '<span class="text_font_RoboL text_size_14px text_color_black">' + values[0] + '</span>';
        rowName.className = 'table__name';

        var rowBonus;
        if (values['описание']) {
            rowBonus.createElement('div');
            rowBonus.innerHTML = '<span class="text_font_RoboL text_size_13px text_color_lightgray">' + values[3] + '</span>';
            rowBonus.className = 'table__bonus';
            tableRow.appendChild(rowBonus);
        }

        var rowYear = document.createElement('div');
        rowYear.innerHTML = '<span class="text_font_RoboL text_size_14px text_color_black">' + values[1] + '</span>';
        rowYear.className = 'table__year';

        var rowColor = document.createElement('div');
        switch (values[4]) {
            case '1': rowColor.innerHTML = '<div class="table__color_white"></div>'; break;
            case '2': rowColor.innerHTML = '<div class="table__color_black"></div>'; break;
            case '3': rowColor.innerHTML = '<div class="table__color_gray"></div>'; break;
            case '4': rowColor.innerHTML = '<div class="table__color_cherry"></div>'; break;
            case '5': rowColor.innerHTML = '<div class="table__color_grass"></div>'; break;
        }
        rowColor.className = 'table__color';

        var rowStatus = document.createElement('div');
        rowStatus.innerHTML = '<span class="text_font_RoboL text_size_14px text_color_black">' + values[values.length - 1] + '</span>';
        rowStatus.className = 'table__status';

        var rowPrice = document.createElement('div');
        rowPrice.innerHTML = '<span class="text_font_RoboL text_size_14px text_color_black">' + values[2] + '</span>';
        rowPrice.className = 'table__price';

        var rowDel = document.createElement('button');
        rowDel.textContent = 'Удалить';
        rowDel.className = 'text_font_RoboL text_size_14px text_color_white table__delete';

        tableRow.appendChild(rowName);
        tableRow.appendChild(rowYear);
        tableRow.appendChild(rowColor);
        tableRow.appendChild(rowStatus);
        tableRow.appendChild(rowPrice);
        tableRow.appendChild(rowDel);

        tableCont.appendChild(tableRow);
    }
})();
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