"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceCard = ({ service }) => {
    return (<div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>);
};
exports.default = ServiceCard;
