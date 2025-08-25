import UnifiedProfileCard2 from '../../components/shared/UnifiedProfileCard2';

const ProfileCard = ({ serviceData }) => {
  console.log("the data is",serviceData);
  return <UnifiedProfileCard2 serviceData={serviceData} mode="view" />;
};

export default ProfileCard;