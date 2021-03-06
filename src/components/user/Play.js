import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeLevelAction, changePageAction} from "../../actions/gameActions";
import {gamePage, registrationPage} from "../../utils/Constants";

const Play = () => {
    const dispatch = useDispatch();
    const levelState = useSelector(state => state.level);

    return (
        <div className={'box_one'}>
            <div className={'play_group'}>
                <div className={'box_two_play'}>
                    <h3 className={'play_h3'}>Register, play and follow your results in the list of winners</h3>
                    <button className={'button button_big button_tutorial_autorization_play'}
                            onClick={() => dispatch(changePageAction(registrationPage))}>
                        Registration
                    </button>
                </div>
                <div className={'box_two_play'}>
                    <h3 className={'play_h3'}>Play without registration and the ability to track your points</h3>
                    <button className={'button button_big button_tutorial_autorization_play'}
                            onClick={() => {
                                if (levelState === 'finish') {
                                    dispatch(changeLevelAction('zero'))
                                }
                                dispatch(changePageAction(gamePage))
                            }}>
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Play;