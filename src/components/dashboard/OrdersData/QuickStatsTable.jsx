const QuickStatsTable = ({ stats }) => {
  return (
    <div>
      <table className="table table-bordered">
        <tbody>
          {stats.map((stat, index) => (
            <>
              <tr key={`title-${index}`}>
                <th>
                  <h4>{stat.title}</h4>
                </th>
              </tr>
              <tr key={`count-${index}`}>
                <td>
                  <a href="#">{stat.count}</a>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuickStatsTable;
