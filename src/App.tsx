import {useState} from "react";


function App() {

    const [isSseConnected, setIsSseConnected] = useState(false);
    const [data, setData] = useState<string[]>([]);

    const connectSse = (instance: number) => {
        const source = new EventSource(`http://localhost:${instance}/event/emitter/connect`, {withCredentials: false});
        source.onmessage = (data) => {
            console.log(data);
        }
        source.addEventListener('testEvent', (data) => {
            // console.log(data.data);
            const message = `${new Date().toLocaleTimeString()} : ${data.data}`
            setData(prev => [...prev, message])
        });
        source.onerror = () => {
            // console.error('error!');
            setIsSseConnected(false);
            const message = `${new Date().toLocaleTimeString()} : SSE 타임 아웃`
            setData(prev => [...prev, message])
        }
        source.onopen = () => {
            console.log('connection opened');
            setIsSseConnected(true);
            const message = `${new Date().toLocaleTimeString()} : SSE 연결됨`
            setData(prev => [...prev, message])
        }
    }

    const serverStatusStyle = {
        width: '200px',
        height: '35px',
        textAlign: 'center',
        lineHeight: '35px',
        backgroundColor: `${isSseConnected ? '#cbf078' : '#e46161'}`,
        color: `${isSseConnected ? '#35495e' : 'white'}`,
        outline: 'none',
        border: 'none',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
    }

    return (
        <>
            <button onClick={() => {
                connectSse(8080)
            }}>인스턴스 1 연결
            </button>
            <button onClick={() => {
                connectSse(8081)
            }}>인스턴스 2 연결
            </button>
            <div style={serverStatusStyle}>서버연결 상태: {isSseConnected ? '연결됨' : '연결 끊김'}</div>
            <div style={{height: '100px', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <ul>
                    {data.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
            </div>
        </>
    )
}

export default App;
