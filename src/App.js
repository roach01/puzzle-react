import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
        step: 0,
        imageUrl: '',
        difficulty: 0,
        options: [
            {difficulty: 0, map: '3x3', width: 190},
            {difficulty: 1, map: '4x4', width: 140},
        ],
        map: []
    };

    componentDidMount() {
        this.gameMap();
    }

    setDifficulty(difficulty) {
        this.setState({difficulty,map:[]});
        this.gameMap();
    }

    gameMap() {
        const {difficulty, options} = this.state;
        const opt = options[difficulty];
        const [X, Y] = opt.map.split('x');
        let map = [];
        const seed = [];
        for (let i = 0; i < X; i++) {
            for (let j = 0; j < Y; j++) {
                map.push({origin: [i, j]});
                seed.push(`${i}${j}`);
            }
        }
        seed.sort(() => Math.random() - 0.5);
        map = map.map((e, index) => ({...e, seed: seed[index]}));
        this.setState({map});
    }

    move(ele) {
        const {map, options, difficulty} = this.state;
        const opt = options[difficulty];
        const [X, Y] = opt.map.split('x');
        const [x, y] = ele.seed.split('');
        map.forEach(function (current) {
            if (JSON.stringify(current.origin) == JSON.stringify([X - 1, Y - 1])) {
                const [invisibleX, invisibleY] = current.seed;
                if ((x == invisibleX || y == invisibleY) && (Math.abs(x - invisibleX) == 1 || Math.abs(y - invisibleY) == 1)) {
                    ele.seed = [invisibleX, invisibleY].join('');
                    current.seed = [x,y].join('');
                }
            }
        });
        this.setState({map})
    }

    renderPuzzle() {
        const {difficulty, options, map} = this.state;
        const opt = options[difficulty];
        const width = opt.width;
        const [_X, _Y] = opt.map.split('x');
        return (
            <div className="puzzle">
                {map.map(((ele, index) => {
                    const [X, Y] = ele.origin;
                    const [x, y] = ele.seed.split('');
                    const style = {
                        width: `${width}px`,
                        height: `${width}px`,
                        backgroundPosition: `${-X * width}px ${-Y * width}px`,
                        left: `${x * (width + 10)}px`,
                        top: `${y * (width + 10)}px`,
                        display: `${(X == _X - 1 && Y == _Y - 1) ? 'none' : 'block'}`
                    };
                    return <div style={style} onClick={e => this.move(ele)} key={index}></div>
                }))}
            </div>
        )
    }


    render() {
        const {map} = this.state;
        return (
            <div className="App">
                {map&&map.length>0?this.renderPuzzle():null}
                <button onClick={e=>this.setDifficulty(0)}>3x3</button>
            </div>
        );
    }
}

export default App;