/* ДЗ 4 - работа с DOM */

/*
 Задание 1:

 1.1: Функция должна создать элемент с тегом DIV

 1.2: В созданный элемент необходимо поместить текст, переданный в параметр text

 Пример:
   createDivWithText('loftschool') // создаст элемент div, поместит в него 'loftschool' и вернет созданный элемент
 */
function createDivWithText(text) {
  const element = document.createElement('div')
  element.textContent = text;
  return element;
}


/*
 Задание 2:

 Функция должна вставлять элемент, переданный в параметре what в начало элемента, переданного в параметре where

 Пример:
   prepend(document.querySelector('#one'), document.querySelector('#two')) // добавит элемент переданный первым аргументом в начало элемента переданного вторым аргументом
 */
function prepend(what, where) {
  where.prepend(what);
}

/*
 Задание 3:

 3.1: Функция должна перебрать все дочерние элементы узла, переданного в параметре where

 3.2: Функция должна вернуть массив, состоящий из тех дочерних элементов следующим соседом которых является элемент с тегом P

 Пример:
   Представим, что есть разметка:
   <body>
      <div></div>
      <p></p>
      <a></a>
      <span></span>
      <p></p>
   </body>

   findAllPSiblings(document.body) // функция должна вернуть массив с элементами div и span т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
  const result = [];
  const whereChildren = where.children;
  for (let i = 0; i <= whereChildren.length; i++) {
    let max = whereChildren.length - 1;
    if (i < max) {
      if (whereChildren[i + 1].tagName === 'P') {
        result.push(whereChildren[i])
      }
    }
  }
  return result;

}

/*
 Задание 4:

 Функция представленная ниже, перебирает все дочерние узлы типа "элемент" внутри узла переданного в параметре where и возвращает массив из текстового содержимого найденных элементов
 Но похоже, что в код функции закралась ошибка и она работает не так, как описано.

 Необходимо найти и исправить ошибку в коде так, чтобы функция работала так, как описано выше.

 Пример:
   Представим, что есть разметка:
   <body>
      <div>привет</div>
      <div>loftschool</div>
   </body>

   findError(document.body) // функция должна вернуть массив с элементами 'привет' и 'loftschool'
 */
function findError(where) {
  const result = [];

  for (const child of where.children) {
    result.push(child.textContent);
  }

  return result;
}

/*
 Задание 5:

 Функция должна перебрать все дочерние узлы элемента переданного в параметре where и удалить из него все текстовые узлы

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
   должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
  const whereChilds = where.childNodes;
  for (let i = 0; i < whereChilds.length; i++) {
    if (whereChilds[i].nodeName === '#text') {
      whereChilds[i].remove();
    }
  }
  return whereChilds
}

/*
 Задание 6 *:

 Необходимо собрать статистику по всем узлам внутри элемента переданного в параметре root и вернуть ее в виде объекта
 Статистика должна содержать:
 - количество текстовых узлов
 - количество элементов каждого класса
 - количество элементов каждого тега
 Для работы с классами рекомендуется использовать classList
 Постарайтесь не создавать глобальных переменных

 Пример:
   Для дерева <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
   должен быть возвращен такой объект:
   {
     tags: { DIV: 1, B: 2},
     classes: { "some-class-1": 2, "some-class-2": 1 },
     texts: 3
   }
 */
function collectDOMStat(root) {
    const rootChildNode = root.childNodes;
    const rootChilds = root.children
    const tagsList = {};
    const classList = {};
    const textCount = rootChildNode.length;
    // инициализируем значения в обьекты.
    for (let i = 0; i < rootChilds.length; i++) {
        const childTagName = rootChilds[i].tagName;
        tagsList[childTagName] = 0;
        if (rootChilds[i].classList.length > 0) {
            for (let j = 0; j < rootChilds[i].classList.length; j++) {
                classList[rootChilds[i].classList[j]] = 0;
            }
        }

    }
    // end for

    // записываем значения родителя
    tagsList[root.tagName] = 1;
    for (let i = 0; i < root.classList.length; i++) {
        classList[root.classList[i]] = 1;
    }
    // end
    // подсчитываем кол-во тэгов.
    for (let key in tagsList) {
        for (let el of rootChilds) {
            if (el.tagName === key) {
                tagsList[key] += 1
            }
        }
    }
    //end for
    // подсчитываем кол-во классов.
    for (let key in classList) {
        for (let el of rootChilds) {
            for (let i = 0; i < el.classList.length; i++) {
                if (el.classList[i] === key) {
                    classList[key] += 1;
                }
            }
        }
    }
    //end for
    return {
        tags: tagsList,
        classes: classList,
        texts: textCount
    }
}

export {
  createDivWithText,
  prepend,
  findAllPSiblings,
  findError,
  deleteTextNodes,
  collectDOMStat,
};
