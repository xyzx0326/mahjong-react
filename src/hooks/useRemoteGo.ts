import {sendAction} from "game-react";

import {useGo} from "./index";

export const useRemoteGo = (mode?: string) => {
    const go = useGo();
    return (action: any) => {
        go(action)
        if (mode && mode === 'remote') {
            if (typeof action === 'function') {
                action(sendAction)
            } else {
                sendAction(action)
            }
        }
    };
}
