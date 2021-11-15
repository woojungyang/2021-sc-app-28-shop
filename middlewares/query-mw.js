module.exports = (_field = 'query', addQuery = []) => {
  return (req, res, next) => {
    req[_field].type = req[_field].type || '';
    req[_field].field = req[_field].field || 'id';
    req[_field].search = req[_field].search || '';
    req[_field].sort = req[_field].sort || 'desc';
    req[_field].page = req[_field].page || 1;
    req[_field].status = req[_field].status || '';
    req[_field].binit = req[_field].binit || '';
    for (let value of addQuery) {
      let k = Object.keys(value);
      let [v] = Object.values(value);
      req[_field][k] = req[_field][k] || v;
    }
    /* 
    ex ) addQuery=[['boardId',1]] -> 2중배열로 들어옴
         boardId ->key / 1->value값으로 for문이 돈다.
    */
    for (let [k, v] of Object.entries(req[_field])) res.locals[k] = v;
    /* 
    정리하자면, 둘의 가장 큰 차이점은 for ...in은 객체(Object)의 key를 순회하고, for ...of는 iterable객체의 value를 순회하는 데 사용한다는 것이다.

    Object.entries() 메서드는 for...in와 같은 순서로 주어진 객체 자체의 enumerable 속성 [key, value] 쌍의 배열을 반환합니다. (for-in 루프가 다른점은 프로토 타입 체인의 속성도 열거한다는 점입니다).
    */

    let goPath = `/${res.locals.currents[0]}/${res.locals.currents[1]}`;
    let goQuery = '';
    if (res.locals.currents[1] === 'board' || res.locals.currents[1] === 'comment') {
      goQuery += `&boardId=${req[_field].boardId}`;
      goQuery += `&boardType=${req[_field].boardType}`;
    }
    if (req[_field].field && req[_field].search) {
      goQuery += `&field=${req[_field].field}`;
      goQuery += `&search=${req[_field].search}`;
    }
    if (req[_field].sort) {
      goQuery += `&sort=${req[_field].sort}`;
    }

    res.locals.goPager = `${goPath}?${goQuery}`;
    res.locals.goList = `${goPath}?${goQuery}&page=${req[_field].page}`;
    res.locals.goPath = goPath;
    res.locals.goQuery = `${goQuery}&page=${req[_field].page}`;
    res.locals.goView = `${goPath}/${req.params.id}?${goQuery}&page=${req[_field].page}`;
    res.locals.goUpdate = `${goPath}/${req.params.id}`;

    res.locals.goLists = [
      { key: 'page', value: req[_field].page },
      { key: 'field', value: req[_field].field },
      { key: 'search', value: req[_field].search },
      { key: 'sort', value: req[_field].sort },
    ];
    if (res.locals.currents[1] === 'board' || res.locals.currents[1] === 'comment') {
      res.locals.goLists.push({ key: 'boardId', value: req[_field].boardId });
      res.locals.goLists.push({ key: 'boardType', value: req[_field].boardType });
    }

    next();
  };
};

/*

Request 객체는 API를 컨트롤하기 위한 메소드를 셋 담고 있다.


1. req.param
주소에 포함된 변수를 담는다. 예를 들어 https://okky.com/post/12345 라는 주소가 있다면 12345를 담는다
2. req.query
주소 바깥, ? 이후의 변수를 담는다. 예를 들어 https://okky.com/post?q=Node.js 일 경우 Node.js를 담는다
3. req.body
XML, JSON, Multi Form 등의 데이터를 담는다. 당연히 주소에선 확인할 수 없다.
*/
