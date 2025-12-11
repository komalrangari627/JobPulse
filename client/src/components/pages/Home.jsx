import React from 'react'

import Header from '../sections/includes/Header'
import Footer from '../sections/includes/Footer'
import JobsGrid from '../sections/jobs/JobsGrid'

const Home = () => {
    return (
        <>
            <Header />
            <JobsGrid />
            <Footer />
        </>
    )
}

export default Home