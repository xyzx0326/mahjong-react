import React, {PropsWithChildren} from 'react';

import './index.scss'

export type FooterProps = {
    mode: string,
    selfIsWhite: boolean,
    isViewer: boolean
} & PropsWithChildren

const Footer: React.FC<FooterProps> = ({mode, selfIsWhite, isViewer, children}) => {
    return (
        <div className="footer">
        </div>
    )
}

export default Footer;
