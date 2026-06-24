import { gql } from "@apollo/client";

export const VEHICLE_IMAGES_QUERY = gql`
  query VehicleImages($where: VehicleImageWhereInput) {
    getAllVehicleImages(where: $where) {
      vehicleImages {
        image
        loanAgreementNo
        registrationNumber
      }
    }
  }
`;
