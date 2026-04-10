"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../constants";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", desc: "", loc: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách từ Blockchain
  async function loadProducts() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const count = await contract.productCount();
      const temp = [];
      for (let i = 1; i <= count; i++) {
        const p = await contract.getProduct(i);
        temp.push(p);
      }
      setProducts(temp.reverse()); // Hiện sản phẩm mới nhất lên đầu
    } catch (e) { console.log(e); }
  }

  useEffect(() => { loadProducts(); }, []);

  async function addProduct() {
    if (!window.ethereum) return alert("Cài MetaMask nhé!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.addProduct(formData.name, formData.desc, formData.loc);
      await tx.wait();
      alert("Ghi lên Blockchain thành công!");
      loadProducts(); // Load lại danh sách ngay
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <main style={{ padding: "20px", color: "black", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Form nhập liệu (giữ nguyên giao diện cũ của bạn) */}
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "20px", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "center" }}>Hệ Thống Truy Xuất</h2>
        <input placeholder="Tên" onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", margin: "10px 0", padding: "10px" }} />
        <input placeholder="Mô tả" onChange={e => setFormData({...formData, desc: e.target.value})} style={{ width: "100%", margin: "10px 0", padding: "10px" }} />
        <input placeholder="Vị trí" onChange={e => setFormData({...formData, loc: e.target.value})} style={{ width: "100%", margin: "10px 0", padding: "10px" }} />
        <button onClick={addProduct} disabled={loading} style={{ width: "100%", padding: "15px", background: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
          {loading ? "Đang ghi lên Blockchain..." : "ĐƯA LÊN BLOCKCHAIN"}
        </button>
      </div>

      {/* Phần danh sách sản phẩm và mã QR */}
      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        <h3>Danh sách sản phẩm đã xác thực:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {products.map((p, index) => (
            <div key={index} style={{ background: "white", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <div>
                <p><strong>ID:</strong> {p.id.toString()}</p>
                <p><strong>Tên:</strong> {p.name}</p>
                <p><strong>Vị trí:</strong> {p.location}</p>
                <small style={{ color: "gray" }}>{new Date(Number(p.timestamp) * 1000).toLocaleString()}</small>
              </div>
              <div style={{ textAlign: "center" }}>
                <QRCodeSVG value={`ID: ${p.id}, Sp: ${p.name}, Origin: ${p.location}`} size={80} />
                <p style={{ fontSize: "10px", marginTop: "5px" }}>Quét để kiểm tra</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}