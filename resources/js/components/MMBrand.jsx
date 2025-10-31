import { t } from 'i18next';
import React from 'react';

const MMBrand = ({textWhite = false, showTech = true}) => {

    const TechStack = () => (
        <p className={textWhite ? 'mt-4 w-full text-center text-white' : 'mt-4 w-full text-center'}>
            Software CRM realizzato da <b className="font-bold">Michele Mincone</b>.<br/>Stack software: <em>PHP 8.4</em>, <em>Laravel 11</em>, <em>React 19.2</em>, <em>Tailwind CSS 3</em>, <em>MySQL 9.4</em>
        </p>
    );

    if (textWhite) {
        return (
            <div className="p4 mt-[50px]">
                <img src="https://michelemincone.com/wp-content/uploads/2025/10/michelemincone_new_logo_alphachannel.png" alt="Michele Mincone Logo" className="h-6 mx-auto mb-2" style={{height: 40}} />
                {showTech && <TechStack />}
            </div>
        );
    }

    return (
        <div className="p4 mt-[50px]">
            <img src="https://michelemincone.com/wp-content/uploads/2025/10/michelemincone_new_logo_alphachannel.png" alt="Michele Mincone Logo" className="h-6 mx-auto mb-2" style={{height: 40}} />
            {showTech && <TechStack />}
        </div>
    );
};

export default MMBrand;