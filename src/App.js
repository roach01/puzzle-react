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
        map: [],
        success:false,
    };

    componentDidMount() {
        this.gameMap();
    }

    setDifficulty(difficulty) {
        this.setState({difficulty,map:[],success:false,step:0});
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
        const {map, options, difficulty,success} = this.state;
        let {step} = this.state;
        if (success){
            return;
        }
        const opt = options[difficulty];
        const [X, Y] = opt.map.split('x');
        const [x, y] = ele.seed.split('');
        map.forEach(function (current) {
            if (JSON.stringify(current.origin) == JSON.stringify([X - 1, Y - 1])) {
                const [invisibleX, invisibleY] = current.seed;
                if ((x == invisibleX || y == invisibleY) && (Math.abs(x - invisibleX) == 1 || Math.abs(y - invisibleY) == 1)) {
                    ele.seed = [invisibleX, invisibleY].join('');
                    current.seed = [x,y].join('');
                    step++;
                }
            }
        });
        this.success(map);
        this.setState({map,step})
    }

    success(map){
        let success = map.reduce((pre,cur)=>{
            if (!pre){
                return false;
            }
            const origin = cur.origin;
            const seed = cur.seed.split('');
            return origin[0]==seed[0]&&origin[1]==seed[1];
        },true);
        this.setState({success})

    }

    renderPuzzle() {
        const {difficulty, options, map,success} = this.state;
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
                        display: `${(X == _X - 1 && Y == _Y - 1)&&!success ? 'none' : 'block'}`
                    };
                    return <div style={style} onClick={e => this.move(ele)} key={index}></div>
                }))}
            </div>
        )
    }


    render() {
        const {map,success,step} = this.state;
        return (
            <div className="App">
                {map&&map.length>0?this.renderPuzzle():null}
                <div className="controls">
                    <button onClick={e=>this.setDifficulty(0)}>重开</button>
                    {success?
                        <div>恭喜成功过关!共用{step}步!</div>
                        :
                        <div>已使用{step}步!</div>
                    }
                </div>
            </div>
        );
    }
}

export default App;
