import React, {useState} from "react";
import {dbService} from "../fbase";

const Nweet = ({nweetObj, isOwner}) => {
        const [editing, setEditing] = useState(false);
        const [newNweet, setNewNweet] = useState(nweetObj.text);
        const onDeleteClick = async () => {
            const ok = window.confirm("Are you sure you want to delete this nweet?");
            if (ok) {
                await dbService.doc(`nweets/${nweetObj.id}`).delete();
            }
        }
        const toggleEditing = () => setEditing((prev) => !prev);
        const onSubmit = async (event) => {
            event.preventDefault();
            await dbService.doc(`nweets/${nweetObj.id}`).update({
                text : newNweet
            })
            setEditing(false);
        };

        const onChange = (event) => {
            const {
                target: {value}
            } = event;
            setNewNweet(value);
        };
        return (
            <div>
                {
                    editing ? (
                        <>
                            {isOwner && (
                                <>
                                    <form onSubmit={onSubmit}>
                                        <input onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet}
                                               required/>
                                        <button onClick={toggleEditing}>Cancel</button>
                                        <input type="submit" value="Update"/>
                                    </form>
                                </>
                                )
                            }
                        </>
                        ) : (
                        <>
                            <h4>{nweetObj.text}</h4>
                            {isOwner && (
                                <>
                                    <button onClick={onDeleteClick}>Delete Nweet</button>
                                    <button onClick={toggleEditing}>Edit Nweet</button>
                                </>
                            )}
                        </>)
                }
            </div>
        );
    }
;

export default Nweet;