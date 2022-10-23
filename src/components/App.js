import React, {useEffect, useState} from "react"
import AppRouter from "components/Router";
import {authService} from "fbase"

function App() {
    const [init, setInit] = useState(false);
    // firebase 사용해서 현재 사용자를 알아냄, isLoggedIn 값으로 지정해준다.
    // const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);  // 이 코드만 작성하면 파이어베이스가 currentUser 조회할 틈이 없음. null 처리.
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // 이 코드만 작성하면 파이어베이스가 currentUser 조회할 틈이 없음. null 처리.
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        // user 변화를 감지(listen)
        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
        authService.onAuthStateChanged((user) => {
                if (user) {
                    setIsLoggedIn(true);
                    setUserObj(user);
                } else {
                    setIsLoggedIn(false);
                }
                setInit(true);
            }
        )
    }, [])
    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    );
}

export default App;
