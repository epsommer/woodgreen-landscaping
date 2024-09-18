// src/pages/Services.js
import ServiceCard from '../elements/ServiceCard.js';
import '../styles/Services.module.css';
const services = [
    {
        title: 'Lawn Care',
        description: 'Professional lawn mowing and maintenance.',
    },
    { title: 'Garden Design', description: 'Beautiful, bespoke garden designs.' },
    { title: 'Tree Trimming', description: 'Expert pruning and tree care.' },
];
const Services = () => {
    return (<div className="services">
			<h2>Our Services</h2>
			<div className="service-list">
				{services.map((service, index) => (<ServiceCard key={index} service={service}/>))}
			</div>
		</div>);
};
export default Services;
