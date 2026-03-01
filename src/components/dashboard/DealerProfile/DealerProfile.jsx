import styles from "./DealerProfile.module.css";

const DealerProfile = ({ data }) => {
  if (!data) return null;

  const profileFields = [
    { label: "DealerShip Name", value: data.dealershipName },
    { label: "Address", value: data.address },
    { label: "User ID", value: data.userId },
    { label: "Email ID", value: data.email },
    { label: "Contact Person", value: data.contactPerson },
    { label: "Mobile No", value: data.mobile }
  ];

  return (
    <div className={styles.dealerProfileContainer}>
      <div className={styles.dealerHeading}>
        <h1>Dealer Profile</h1>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.dealerTable}>
          <tbody>
            {profileFields.map((field, index) => {
              if (index % 2 === 0) {
                return (
                  <tr key={index}>
                    <th>{field.label}:</th>
                    <td>{field.value}</td>
                    {profileFields[index + 1] && (
                      <>
                        <th>{profileFields[index + 1].label}:</th>
                        <td>{profileFields[index + 1].value}</td>
                      </>
                    )}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealerProfile;