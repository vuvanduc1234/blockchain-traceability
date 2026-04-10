"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../constants";
import { QRCodeSVG } from "qrcode.react";

// Khai báo kiểu cho window.ethereum để tránh lỗi TypeScript khi build trên Vercel
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [formData, setFormData] = useState({ name: "", desc: "", loc: "" });
  const [products, setProducts] = useState<any[]>([]); // Thêm kiểu dữ liệu mảng
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách từ Blockchain
  async function loadProducts() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const count = await contract.productCount();
        const temp = [];
        for (let i = 1; i <= Number(count); i++) {
          const p = await contract.getProduct(i);
          temp.push(p);
        }
        setProducts(temp.reverse());
      } catch (e) {
        console.log("Lỗi tải sản phẩm:", e);
      }
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

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
      setFormData({ name: "", desc: "", loc: "" }); // Reset form
      loadProducts();
    } catch (e) {
      console.error("Lỗi khi thêm sản phẩm:", e);
    }
    setLoading(false);
  }

  return (
    <main style={{ padding: "20px", color: "black", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Hệ Thống Truy Xuất</h2>
        <input 
          value={formData.name}
          placeholder="Tên sản phẩm" 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          style={{ width: "100%", margin: "10px 0", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }} 
        />
        <input 
          value={formData.desc}
          placeholder="Mô tả" 
          onChange={e => setFormData({...formData, desc: e.target.value})} 
          style={{ width: "100%", margin: "10px 0", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }} 
        />
        <input 
          value={formData.loc}
          placeholder="Vị trí/Nguồn gốc" 
          onChange={e => setFormData({...formData, loc: e.target.value})} 
          style={{ width: "100%", margin: "10px 0", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }} 
        />
        <button 
          onClick={addProduct} 
          disabled={loading} 
          style={{ 
            width: "100%", 
            padding: "15px", 
            background: loading ? "#ccc" : "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          {loading ? "Đang ghi lên Blockchain..." : "ĐƯA LÊN BLOCKCHAIN"}
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        <h3 style={{ borderBottom: "2px solid #0070f3", paddingBottom: "10px" }}>Danh sách sản phẩm đã xác thực:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {products.length === 0 ? <p>Chưa có sản phẩm nào.</p> : products.map((p, index) => (
            <div key={index} style={{ background: "white", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "5px 0" }}><strong>ID:</strong> {p.id.toString()}</p>
                <p style={{ margin: "5px 0" }}><strong>Tên:</strong> {p.name}</p>
                <p style={{ margin: "5px 0" }}><strong>Vị trí:</strong> {p.location}</p>
                <small style={{ color: "gray" }}>{new Date(Number(p.timestamp) * 1000).toLocaleString()}</small>
              </div>
              <div style={{ textAlign: "center", marginLeft: "15px" }}>
                <QRCodeSVG value={`https://sepolia.etherscan.io/address/${contractAddress}`} size={80} />
                <p style={{ fontSize: "10px", marginTop: "5px", color: "#666" }}>Quét để kiểm tra</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}