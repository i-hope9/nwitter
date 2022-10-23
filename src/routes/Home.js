import React, {useEffect, useState} from "react"
import {dbService} from "../fbase";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    // snapshot 이용한 realtime 코드 작성 전
    // const getNweets = async () => {
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach(doc => {
    //         const nweetObject = {   // spread object
    //             ...doc.data(),
    //             id: doc.id,
    //         }
    //         setNweets((prev) => [nweetObject, ...prev]);   // 값 대신 함수 전달. 이전 값에 접근 가능.
    //     });
    // }
    useEffect(() => {
        // getNweets();
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setNweets(nweetArray);
        })
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?"
                       maxLength={120}/>
                <input type="submit" value="Nweet"/>
            </form>
            <div>
                {nweets.map(nweet =>
                    <div key={nweet.id}>
                        <h4>{nweet.text}</h4>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Home;
