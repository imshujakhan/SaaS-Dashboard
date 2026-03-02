import styles from "./DealerProfile.module.css";
import DealerProfileRow from "./DealerProfileRow";

const DealerProfileTable = ({ profileFields }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.dealerTable}>
        <tbody>
          {profileFields.map((field, index) => {
            if (index % 2 === 0) {
              return (
                <DealerProfileRow
                  key={index}
                  field1={field}
                  field2={profileFields[index + 1]}
                />
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DealerProfileTable;
