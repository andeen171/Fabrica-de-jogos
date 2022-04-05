import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBaseState } from '../../reducers/baseReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {
    game: String;
};

export default function GamePage({ game }: Props) {
    const { slug } = useParams();
    const [open, setOpen] = useState(false);
    const { token, origin } = useSelector((state: RootState) => state.base);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBaseState());
        setTimeout(() => {
            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) {
                    const data = event.data;
                    if (data.loaded) {
                        let game_address =
                            'https://fabricadejogos.portaleducacional.tec.br';
                        let iframe: HTMLIFrameElement = document.getElementById(
                            'frame'
                        ) as HTMLIFrameElement;
                        const message = JSON.stringify({
                            user_token: token,
                            origin: origin,
                            game_address: game_address,
                            slug: slug,
                            aula_id: urlParams.has('aula_id')
                                ? urlParams.get('aula_id')
                                : 0,
                            conteudo_id: urlParams.has('conteudo_id')
                                ? urlParams.get('conteudo_id')
                                : 0
                        });
                        // @ts-ignore
                        iframe.contentWindow.postMessage(message, '*');
                    }
                }
            });
            setOpen(true);
        }, 1000);
    }, [localStorage.getItem('token')]);
    let gameAddress = '';
    switch (game) {
        case 'quiz':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/Quiz%20%281%29/index.html';
            break;
        case 'wordSearch':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/Caca-Palavras%20%281%29/index.html';
            break;
        case 'anagram':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/Anagrama%20%281%29/index.html';
            break;
        case 'trueOrFalse':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/VerdadeiroOuFalso%20%282%29/index.html';
            break;
        case 'matchUp':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/SignificadosDasPalavras%20%281%29/index.html';
            break;
        case 'memoryGame':
            gameAddress =
                'https://nyc3.digitaloceanspaces.com/metech/API-ATUALIZADA/JogoDaMemória%20%281%29/index.html';
            break;
    }
    return (
        <div>
            {open && (
                <iframe
                    id="frame"
                    src={gameAddress}
                    height="100%"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                        position: 'fixed',
                        top: '0px',
                        bottom: '0px',
                        right: '0px',
                        border: 'none',
                        margin: 0,
                        padding: 0,
                        overflow: 'hidden',
                        zIndex: 999999
                    }}
                />
            )}
        </div>
    );
}
