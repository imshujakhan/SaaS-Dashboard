// Run this in browser console on any page to add dealers to mockapi.io

const API_BASE = "https://69a22f42be843d692bd0f181.mockapi.io/api/v1";

const dealers = [
  {
    dealerId: "D001",
    dealershipName: "Shuja HSRP Center",
    contactPerson: "Shuja",
    email: "shuja@hsrp.com",
    mobile: "9876543210",
    address: "Shop No. 12, Andheri East, Mumbai - 400069",
    password: "admin1234"
  },
  {
    dealerId: "D002",
    dealershipName: "Khan HSRP Center",
    contactPerson: "Khan",
    email: "khan@hsrp.com",
    mobile: "9876543211",
    address: "Block A, Connaught Place, New Delhi - 110001",
    password: "admin1234"
  }
];

async function addDealers() {
  for (const dealer of dealers) {
    const res = await fetch(`${API_BASE}/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealer)
    });
    const data = await res.json();
    console.log('Added dealer:', data);
  }
}

addDealers();
