import React, {useEffect, useState} from "react"
import {dbService, storageService} from "../fbase";
import Nweet from "../components/Nweet";
import {v4 as uuidv4} from "uuid";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();
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
        // snapshot: 실시간으로 DB 변화 감지
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),  // doc.data() 안을 풀어서 넣는다
            }));
            setNweets(nweetArray);
        })
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        // 1. 사진이 있으면 사진을 먼저 버킷에 넣는다.
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        // 2. 사진의 url 정보를 nweet 문서에 넣는다.
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        });
        setNweet("");
        setAttachment("");
    };
    const onFileChange = (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    };
    const onClearAttachmentClick = () => setAttachment(null);
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
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" alt="attached image"/>
                        <button onClick={onClearAttachmentClick}>Cancel upload</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map(nweet =>
                    <Nweet key={nweet.id}
                           nweetObj={nweet}
                           isOwner={nweet.creatorId === userObj.uid}
                    />
                )}
            </div>
        </div>
    )
}
export default Home;
