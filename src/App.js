import React, {Component} from 'react';
import './App.css';
import bg0 from './static/bg.jpeg'
import bg1 from './static/bg1.jpeg'
import bg2 from './static/bg2.jpeg'



const width = 600;
const border = 0;
const imageUrls = [bg0,bg1,bg2];

class App extends Component {
    state = {
        step: 0,
        imageUrl: bg0,
        imageUrlBak: bg0,
        difficulty:0,
        options: [
            {difficulty: 0, map: '3x3', width: width/3-border},
            {difficulty: 1, map: '4x4', width: width/4-border},
            {difficulty: 2, map: '5x5', width: width/5-border},
            {difficulty: 3, map: '6x6', width: width/6-border},
            {difficulty: 4, map: '10x10', width: width/10-border},
        ],
        map: [],
        success:false,
    };

    componentDidMount() {
        this.gameMap();
    }
    setDefault(num){
        const imageUrl = imageUrls[num];
        this.setState({imageUrl,imageUrlBak:imageUrl})
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
        //seed.sort(() => Math.random() - 0.5);
        map = map.map((e, index) => ({...e, seed: seed[index]}));
        this.createLevel(map);
        this.setState({map});
    }


    createLevel(map){
        this.createMove(map,null,200);
    }

    createMove(map,lastEle,times){
        if (times==0){
            return;
        }
        times--;
        const blank = map[map.length-1];

        const [blankX,blankY] = blank.seed.split('').map(e=>Number(e));
        const nearby = [`${blankX+1}${blankY}`,`${blankX-1}${blankY}`,`${blankX}${blankY+1}`,`${blankX}${blankY-1}`];
        const nearbyEle = map.filter(ele=>{
            return nearby.indexOf(ele.seed)!=-1&&(!lastEle||ele.seed!=lastEle.seed);
        });
        const moveEle = nearbyEle[Math.floor(Math.random()*nearbyEle.length)];
        const [x,y] = moveEle.seed.split('');
        moveEle.seed = [blankX, blankY].join('');
        blank.seed = [x,y].join('');
        this.createMove(map,moveEle,times);
    }

    move(ele) {
        const {map, options, difficulty,success} = this.state;
        let {step} = this.state;
        const self = this;
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
                    self.success(map);
                    self.setState({map,step})
                }
            }
        });

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
    setUrl(){
        const {imageUrlBak} = this.state;
        this.setState({imageUrl:imageUrlBak});
    }
    changeUrl(e){
        this.setState({imageUrlBak:e.target.value})
    }

    renderPuzzle() {
        const {difficulty, options, map,success,imageUrl} = this.state;
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
                        left: `${x * (width + border)}px`,
                        top: `${y * (width + border)}px`,
                        backgroundImage:`url(${imageUrl})`,
                        opacity: `${(X == _X - 1 && Y == _Y - 1)&&!success ? '0' : '1'}`
                    };
                    return <div id={ele.origin.join('')} style={style} onClick={e => this.move(ele)} key={index}></div>
                }))}
            </div>
        )
    }


    render() {
        const {map,success,step,imageUrlBak} = this.state;
        return (
            <div className="App">
                {map&&map.length>0?this.renderPuzzle():null}
                <div className="controls">
                    <button onClick={e=>this.setDifficulty(0)}>重开</button>
                    <button onClick={e=>this.setDefault(0)}>图像1</button>
                    <button onClick={e=>this.setDefault(1)}>图像2</button>
                    <button onClick={e=>this.setDefault(2)}>图像3</button>
                    <button onClick={e=>this.setUrl()}>设置图像地址</button>
                    <div className="image-div">
                        <input onChange={e=>this.changeUrl(e)} value={imageUrlBak}/>
                        <div>
                            {success?
                                <span>恭喜成功过关!共用{step}步!</span>
                                :
                                <span>已使用{step}步!</span>
                            }
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
