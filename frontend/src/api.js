// const API_BASE_URL = "http://localhost:5000/api/child";

// // ✅ Fetch child details
// export const fetchChildDetails = async (userEmail) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/${userEmail}`);

//     if (!response.ok) {
//       // If response status is 404 or any non-success, handle it here
//       console.warn("No child details found or server error.");
//       return null;
//     }

//     const data = await response.json();

//     // Optional: if API returns empty array or null
//     if (!data || data.length === 0) {
//       return null;
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching child details:", error);
//     return null;
//   }
// };


// // ✅ Add child details
// export const addChildDetails = async (formData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error("Error adding child details:", error);
//     return null;
//   }
// };

// // ✅ Delete child details
// export const deleteChild = async (childId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/delete/${childId}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to delete child: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error deleting child:", error);
//     return null;
//   }
// };



const API_BASE_URL = "http://localhost:5000/api/children";

// ✅ Fetch child details
export const fetchChildDetails = async (userEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userEmail}`);
    if (!response.ok) {
      console.warn("No child details found or server error.");
      return null;
    }
    const data = await response.json();
    return data.length === 0 ? null : data;
  } catch (error) {
    console.error("Error fetching child details:", error);
    return null;
  }
};

// ✅ Add child details
export const addChildDetails = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding child details:", error);
    return null;
  }
};

// ✅ Delete child details
export const deleteChild = async (childId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${childId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete child: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting child:", error);
    return null;
  }
};

import axios from "axios";

export const updateChildLocation = async (id, location) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/children/update-location/${id}`, location);
    return res.data;
  } catch (error) {
    console.error("Error updating location", error);
    return null;
  }
};

export const setSafeZone = async (zoneData) => {
  try {
    const res = await fetch("http://localhost:5000/api/set-safe-zone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zoneData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Safe Zone error:", error);
    throw error;
  }
};
