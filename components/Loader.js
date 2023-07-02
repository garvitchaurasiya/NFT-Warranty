import React from 'react'
import styles from '../styles/Loader.module.css';

const Loader = (props) => {
    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
            <div className='my-4 text-gray-400'>{props.message}</div>
        </div>
    )
}

export default Loader