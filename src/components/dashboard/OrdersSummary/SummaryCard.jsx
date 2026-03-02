import { Link } from "react-router-dom";

const SummaryCard = ({ count, label, link, className }) => {
  return (
    <div className={className}>
      <h1>{count}</h1>
      <Link to={link}>{label}</Link>
    </div>
  );
};

export default SummaryCard;
