// src/pages/Home.js``
import Header from '../elements/Header.js';
import '../styles/Home.module.css';

const Home = () => {
	return (
		<div>
			<Header />
			<section className="home-intro">
				<h2>Welcome to Our Landscaping Service</h2>
				<p>We create beautiful outdoor spaces that suit your lifestyle.</p>
			</section>
		</div>
	);
};

export default Home;
