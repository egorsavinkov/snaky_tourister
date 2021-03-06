import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useInterval} from "../../utils/useInterval";
import styleCSS from './game.module.css'
import Snake from "./Snake";
import Point from "./Point";
import Barrier from "./Barrier";
import {
    changeGamePointsAction, changeLevelAction, changeLevelPointsAction, changePageAction
} from "../../actions/gameActions";
import {
    DOWN,
    gameOverPage,
    LEFT,
    levelArr,
    levelArrOne, levelArrThree,
    levelArrTwo,
    levelShowplace,
    nextLevelPage,
    RIGHT,
    snakeArr,
    UP
} from "../../utils/Constants";

const Game = () => {
    const gamePoints = useSelector(state => state.gamePoints);
    const levelPoints = useSelector(state => state.levelPoints);
    const levelState = useSelector(state => state.level);
    const levelBarrier = useSelector(state => state.barrier[levelState]);
    const dispatch = useDispatch();
    const [levelShowplaceState, setLevelShowplaceState] = useState(0);

    const changeLevelShowplaceState = (points) => {
        switch (points) {
            case 50:
                return setLevelShowplaceState(1);
            case 100:
                return setLevelShowplaceState(2);
            case 150:
                return setLevelShowplaceState(3);
            case 200:
                return setLevelShowplaceState(4);
        }
    }

    const searchImagesLevelShowplace = (level) => {
        let lvl = levelArr.indexOf(level);
        let arr = levelShowplace[lvl];
        return arr[levelShowplaceState];
    }

    const getRandomCoordinates = () => {
        let min = 1;
        let max = 98;
        let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
        let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
        return [x, y];
    }

    const [point, setPoint] = useState(getRandomCoordinates());
    const [speed, setSpeed] = useState(200);
    const [direction, setDirection] = useState(RIGHT);
    const [snakeDots, setSnakeDots] = useState(snakeArr);

    const onKeyDown = (e) => {
        e = e || window.event;
        let dir = direction;
        if ((e.keyCode === 38 && dir === DOWN) || (e.keyCode === 40 && dir === UP) ||
            (e.keyCode === 37 && dir === RIGHT) || (e.keyCode === 39 && dir === LEFT)) {
            return;
        }
        switch (e.keyCode) {
            case 38:
                setDirection(UP);
                break;
            case 40:
                setDirection(DOWN);
                break;
            case 37:
                setDirection(LEFT);
                break;
            case 39:
                setDirection(RIGHT);
                break;
        }
    }

    const moveSnake = () => {
        let dots = [...snakeDots];
        let head = dots[dots.length - 1];
        switch (direction) {
            case RIGHT:
                head = [head[0] + 2, head[1]];
                break;
            case LEFT:
                head = [head[0] - 2, head[1]];
                break;
            case DOWN:
                head = [head[0], head[1] + 2];
                break;
            case UP:
                head = [head[0], head[1] - 2];
                break;
        }
        dots.push(head);
        dots.shift();
        setSnakeDots(dots);
    }

    const checkIfOutBorders = () => {
        let head = snakeDots[snakeDots.length - 1];
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
            dispatch(changePageAction(gameOverPage));
        }
    }

    const checkIfOutCollapsed = () => {
        let snake = [...snakeDots];
        let head = snake[snake.length - 1];
        snake.pop();
        snake.forEach(dot => {
            if (head[0] === dot[0] && head[1] === dot[1]) {
                dispatch(changePageAction(gameOverPage));
            }
        })
    }

    const checkIfOutBarrier = () => {
        let snake = [...snakeDots];
        let head = snake[snake.length - 1];
        levelBarrier.forEach(dotBarrier => {
            if (head[0] === dotBarrier[0] && head[1] === dotBarrier[1]) {
                dispatch(changePageAction(gameOverPage));
            }
        })
    }

    const checkIfEat = () => {
        let head = snakeDots[snakeDots.length - 1];
        let p = point;
        if (head[0] === p[0] && head[1] === p[1]) {
            setPoint(getRandomCoordinates());
            enlargeSnake();
            dispatch(changeLevelPointsAction(levelPoints + 1));
            dispatch(changeGamePointsAction(gamePoints + 1));
            increaseSpeed();
        }
    }

    const enlargeSnake = () => {
        let newSnake = [...snakeDots];
        newSnake.unshift([]);
        setSnakeDots(newSnake);
    }

    const increaseSpeed = () => {
        if (speed > 10) {
            setSpeed(speed - 10);
        }
    }

    const changeLevelSpeed = (level) => {
        switch (level) {
            case levelArr[0]:
                setSpeed(130);
                break;
            case levelArr[1]:
                setSpeed(110);
                break;
            case levelArr[2]:
                setSpeed(90);
                break;
            case levelArr[3]:
                setSpeed(70);
                break;
        }
    }

    const searchNextLevel = (currentLevel) => {
        let lvl = levelArr.indexOf(currentLevel);
        return levelArr[lvl + 1];
    }

    const searchStartPositionEatSnake = () => {
        for (let i = 0; i < snakeDots.length; i++) {
            if (snakeDots[i][0] === point[0] && snakeDots[i][1] === point[1]) {
                setPoint(getRandomCoordinates());
            }
        }
    }

    const searchStartPositionEatBarrier = (level) => {
        switch (level) {
            case 'one':
                for (let i = 0; i < levelArrOne.length; i++) {
                    if (levelArrOne[i][0] === point[0] && levelArrOne[i][1] === point[1]) {
                        setPoint(getRandomCoordinates());
                    }
                }
                break;
            case 'two':
                for (let i = 0; i < levelArrTwo.length; i++) {
                    if (levelArrTwo[i][0] === point[0] && levelArrTwo[i][1] === point[1]) {
                        setPoint(getRandomCoordinates());
                    }
                }
                break;
            case 'three':
                for (let i = 0; i < levelArrThree.length; i++) {
                    if (levelArrThree[i][0] === point[0] && levelArrThree[i][1] === point[1]) {
                        setPoint(getRandomCoordinates());
                    }
                }
                break;
        }
    }

    useEffect(() => {
        document.onkeydown = onKeyDown;
        checkIfOutBorders();
        checkIfOutCollapsed();
        checkIfEat();
        checkIfOutBarrier();
        changeLevelSpeed(levelState);
        changeLevelShowplaceState(levelPoints);
    })

    useEffect(() => {
        searchStartPositionEatSnake();
        searchStartPositionEatBarrier(levelState);
    }, [point])

    useInterval(() => moveSnake(), speed);

    return (
        <div id={`${styleCSS.game}`}>
            <div className={`${styleCSS.block_left}`}>
                <div className={'showplace_min'}>
                    <img className={'showplace_img'} src={searchImagesLevelShowplace(levelState)} alt={''}/>
                    {levelPoints < 200 &&
                    <h6 className={'showplace_h6'}>Next level:<br/>{200 - levelPoints} points</h6>}
                    {levelPoints >= 200 && <h6 className={'showplace_h6'}>You have {levelPoints} points per level</h6>}
                </div>
                {levelPoints >= 200 &&
                <button className={`button button_big ${styleCSS.button_next_level}`}
                        onClick={() => {
                            dispatch(changePageAction(nextLevelPage));
                            dispatch(changeLevelAction(searchNextLevel(levelState)));
                        }}>
                    Next level
                </button>}
            </div>
            <div className={styleCSS.game_area}>
                <Snake snakeDots={snakeDots}/>
                <Point dot={point}/>
                <Barrier/>
            </div>
            <div className={`${styleCSS.block_right}`}>
            </div>
        </div>
    );
};

export default Game;