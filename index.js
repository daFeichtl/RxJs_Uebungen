
window.onload = function (){
    const Rx = rxjs;
    const {
        Observable,
        Subject,
        ReplaySubject,
        BehaviorSubject
    } = rxjs;
    const {
        buffer,
        bufferCount,
        bufferTime,
        combineLatest,
        concat,
        connect,
        count,
        debounce,
        debounceTime,
        delay,
        distinct,
        distinctUntilChanged,
        filter,
        flatMap,
        from,
        forkJoin,
        map,
        max,
        merge,
        min,
        pairwise,
        publish,
        reduce,
        refCount,
        skip,
        switchMap,
        take,
        takeWhile,
        tap,
        throttle,
        throttleTime,
    } = rxjs.operators;


    calcBmi();
    getComments();
    getAlbumsAndTodos();
    initAutocomplete();


    function setBmi(weight, height){

        document.querySelector("#bmiValue").innerText = (weight/(height*height)).toFixed(2)+"";
    }

    function calcBmi(){
        let weight = 1;
        let height = 1;
        Rx.fromEvent(document.querySelector('#rngWeight'), 'input')
            .pipe(
                map(e => e.target.value)
            )
            .subscribe(x => {
                weight = x
                document.querySelector("#bmiWeight").innerText = (weight*1).toFixed(0)+"";
                setBmi(weight,height)
            });

        Rx.fromEvent(document.querySelector('#rngHeight'), 'input')
            .pipe(
                map(e => e.target.value),
                map(height => height/100)
            )
            .subscribe(x => {
                height = x
                document.querySelector("#bmiHeight").innerText = (height*100).toFixed(0)+"";
                setBmi(weight, height)
            })
    }

    async function getUser(commentId){
        const postId = await fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`)
            .then(x => x.json())
            .then(x => {
                return x.postId;
            })
        const userId = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(x => x.json())
            .then(x => {
                return x.userId;
            })
        return await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then(x => x.json())
            .then(x => {
                return `${x.username}[=${x.name}]`;
            });
    }
    function getComments(){
        Rx.fromEvent(document.querySelector('#rngCommentId'), 'input')
            .pipe(
                map(e => e.target.value),
                tap(async x => {
                    document.querySelector("#commentId").innerText = x
                    document.querySelector("#commentUser").innerText = await getUser(x)
                })
            )
            .subscribe()
    }

    function getAlbumsAndTodos(){
        Rx.fromEvent(document.querySelector('#rngParallel'), 'input')
            .pipe(
                map(e => e.target.value),
                tap(x => {
                    clearAlbumsAndTodos();
                    getAlbums(x).then(x => setAlbums(x))
                    getTodos(x).then(x => setTodos(x))
                })
            )
            .subscribe()
    }
    function getAlbums(id){
        return fetch(`https://jsonplaceholder.typicode.com/albums?userId=${id}`)
            .then(x => x.json())
    }
    function getTodos(id){
        return fetch(`https://jsonplaceholder.typicode.com/todos?userId=${id}`)
            .then(x => x.json())
    }
    function setAlbums(albums){
        albums.map(x => `<li>${x.title}</li>`)
            .slice(0,5)
            .forEach(x => document.querySelector("#lstAlbums").innerHTML += x)
    }
    function setTodos(todos){
        todos.map(x => `<li>${x.title}</li>`)
            .slice(0,5)
            .forEach(x => document.querySelector("#lstTodos").innerHTML += x)
    }
    function clearAlbumsAndTodos(){
        document.querySelector("#lstAlbums").innerHTML = "";
        document.querySelector("#lstTodos").innerHTML = "";
    }

    function initAutocomplete(){
        let isActive = false;
        Rx.fromEvent(document.querySelector('#toggle'), 'click')
            .pipe(
                tap(x => {
                    isActive = !isActive;
                    document.querySelector("#toggle").innerText = isActive ? "Stop" : "Start";
                })
            )
            .subscribe()




        Rx.fromEvent(document.querySelector('#txtPerson'), 'input')
            .pipe(
                map(e => e.target.value),
                debounceTime(500),
                tap(x => {
                    if(isActive){
                        getPersons(x).then(x => setPersons(x))
                    }
                }),
            )
            .subscribe()
    }
    function getPersons(name) {
        console.log(name)
        return fetch(`http://localhost:3000/persons`)
            .then(x => x.json())
            .then(x => x.map(x => x.firstname+" "+x.lastname))
            .then(x => x.filter(x => x.concat("").toLowerCase().includes(name)))
    }
    function setPersons(names) {
        document.querySelector("#lstPersons").innerHTML = "";
        names.forEach(x => document.querySelector("#lstPersons").innerHTML += `<li>${x}</li>`)
    }
}

