// components/Marquee.js
import React from 'react';

const names = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Ethan',
    'Fiona',
    'George',
    'Hannah',
];

export default function Marquee() {
    return (
        <div className={`marquee`}>
            {/* First copy */}
            <div className={`marqueeContent`}>
                {names.map((name, index) => (
                    <span className={`nameItem`} key={`${name}-${index}`}>
            {name}
          </span>
                ))}
            </div>

            {/* Second copy (duplicate) */}
            <div aria-hidden={"true"} className={`marqueeContent`}>
                {names.map((name, index) => (
                    <span className={`nameItem`} key={`copy-${name}-${index}`}>
            {name}
          </span>
                ))}
            </div>
        </div>
    );
}