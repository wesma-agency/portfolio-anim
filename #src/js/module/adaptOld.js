(function () {
    let adaptivItems = document.querySelectorAll("[data-adaptiv]");
    let defaultPlace = [];

    let adaptivItemsArray = [];

    let adaptivMatch = [];
    //Заполняем массивы
    if (adaptivItems.length > 0) {
        let index = 0;
        for (let i = 0; i < adaptivItems.length; i++) {
            const adaptivElement = adaptivItems[i];
            const adaptivMove = adaptivElement.getAttribute("data-adaptiv");
            if (adaptivMove != "") {
                const adaptivArray = adaptivMove.split(",");
                const adaptivPlace = adaptivArray[1] ? adaptivArray[1].trim() : "last";
                const adaptivBreakpoint = adaptivArray[2]
                    ? adaptivArray[2].trim()
                    : "768";
                const adaptivType =
                    adaptivArray[3] === "min" ? adaptivArray[3].trim() : "max";
                const adaptivDestination = document.querySelector(
                    "." + adaptivArray[0].trim()
                );
                if (adaptivArray.length > 0 && adaptivDestination) {
                    adaptivElement.setAttribute("data-adaptiv-i", index);
                    //Заполняем массив первоначальных позиций
                    defaultPlace[index] = {
                        parent: adaptivElement.parentNode,
                        i: indexParent(adaptivElement),
                    };
                    //Заполняем массив элементов
                    adaptivItemsArray[index] = {
                        element: adaptivElement,
                        destination: document.querySelector("." + adaptivArray[0].trim()),
                        place: adaptivPlace,
                        breakpoint: adaptivBreakpoint,
                        type: adaptivType,
                    };
                    index++;
                }
            }
        }
        SortAdapt(adaptivItemsArray);

        //Создаем события в точке брейкпоинта
        for (let i = 0; i < adaptivItemsArray.length; i++) {
            const element = adaptivItemsArray[i];
            const adaptivBreakpoint = element.breakpoint;
            const adaptivType = element.type;

            adaptivMatch.push(
                window.matchMedia(
                    "(" + adaptivType + "-width: " + adaptivBreakpoint + "px)"
                )
            );
            adaptivMatch[i].addListener(funcAdapt);
        }
    }
    //Основная функция
    function funcAdapt() {
        for (let i = 0; i < adaptivItemsArray.length; i++) {
            const element = adaptivItemsArray[i];
            const adaptivElement = element.element;
            const adaptivDestination = element.destination;
            const adaptivPlace = element.place;
            const adaptivBreakpoint = element.breakpoint;
            const adaptClass = "adapt_" + adaptivBreakpoint;

            if (adaptivMatch[i].matches) {
                if (!adaptivElement.classList.contains(adaptClass)) {
                    let actualIndex = adaptivPlace;

                    if (adaptivPlace === "first") {
                        actualIndex = indexGetParentArr(adaptivDestination)[0];
                    } else if (adaptivPlace === "last") {
                        actualIndex = indexGetParentArr(adaptivDestination).length;
                    }
                    adaptivDestination.insertBefore(
                        adaptivElement,
                        adaptivDestination.children[actualIndex]
                    );
                    adaptivElement.classList.add(adaptClass);
                }
            } else {
                if (adaptivElement.classList.contains(adaptClass)) {
                    backElement(adaptivElement);
                    adaptivElement.classList.remove(adaptClass);
                }
            }
        }
    }

    //Вызов основной функции
    funcAdapt();

    //Функция возврата на место
    function backElement(element) {
        const Index = element.getAttribute("data-adaptiv-i");
        const originalPlace = defaultPlace[Index];
        const parentPlace = originalPlace["parent"];
        const indexPlace = originalPlace["i"];
        const actualIndex = indexGetParentArr(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(element, parentPlace.children[actualIndex]);
    }
    //Функция получения индекса внутри родителя
    function indexParent(element) {
        var children = Array.prototype.slice.call(element.parentNode.children);
        return children.indexOf(element);
    }
    //Функция получения массива индексов элементов внутри родителя
    function indexGetParentArr(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute("data-adaptiv") == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }
    //Сортировка объекта
    function SortAdapt(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) {
                return -1;
            } else {
                return 1;
            }
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) {
                return 1;
            } else {
                return -1;
            }
        });
    }
})();