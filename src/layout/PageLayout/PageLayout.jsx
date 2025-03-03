import styles from './PageLayout.module.css';

const PageLayout = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <aside className={styles.aside}>
                <div>Search history 1</div>
                <div>Search history 2</div>
                <div>Search history 3</div>
            </aside>

            {children}

        </div>
    )
}

export default PageLayout