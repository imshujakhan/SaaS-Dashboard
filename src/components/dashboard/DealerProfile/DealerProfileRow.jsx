
const DealerProfileRow = ({ field1, field2 }) => {
  return (
    <tr>
      <th>{field1.label}:</th>
      <td>{field1.value}</td>
      {field2 && (
        <>
          <th>{field2.label}:</th>
          <td>{field2.value}</td>
        </>
      )}
    </tr>
  );
};

export default DealerProfileRow;
