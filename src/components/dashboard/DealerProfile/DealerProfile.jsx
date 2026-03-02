import styles from "./DealerProfile.module.css";
import DealerProfileHeader from "./DealerProfileHeader";
import DealerProfileTable from "./DealerProfileTable";

const DealerProfile = ({ data }) => {
  if (!data) return null;

  const profileFields = [
    { label: "DealerShip Name", value: data.dealershipName },
    { label: "Address", value: data.address },
    { label: "User ID", value: data.dealerId },
    { label: "Email ID", value: data.email },
    { label: "Contact Person", value: data.contactPerson },
    { label: "Mobile No", value: data.mobile }
  ];

  return (
    <div className={styles.dealerProfileContainer}>
      <DealerProfileHeader />
      <DealerProfileTable profileFields={profileFields} />
    </div>
  );
};

export default DealerProfile;