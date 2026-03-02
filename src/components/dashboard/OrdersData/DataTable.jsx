const DataTable = ({ headers, rows }) => {
  return (
    <div>
      <table className="table table-bordered">
        <tbody>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>
                <h4>{header}</h4>
              </th>
            ))}
          </tr>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cell.link ? <a href="#">{cell.value}</a> : cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
