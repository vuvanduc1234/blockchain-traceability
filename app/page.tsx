"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../constants";
import { QRCodeSVG } from "qrcode.react";
// Import thư viện thông báo
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [formData, setFormData] = useState({ name: "", desc: "", loc: "" });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho bộ lọc tìm kiếm

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
    if (!window.ethereum) {
      toast.error("Vui lòng cài đặt MetaMask!");
      return;
    }
    
    if(!formData.name || !formData.loc) {
      toast.warning("Vui lòng nhập tên và vị trí!");
      return;
    }

    setLoading(true);
    const id = toast.loading("Đang khởi tạo giao dịch...");
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      const tx = await contract.addProduct(formData.name, formData.desc, formData.loc);
      
      toast.update(id, { render: "Đang ghi vào Blockchain (Sepolia)...", type: "info", isLoading: true });
      
      await tx.wait();
      
      toast.update(id, { render: "Xác thực thành công! 🎉", type: "success", isLoading: false, autoClose: 5000 });
      setFormData({ name: "", desc: "", loc: "" });
      loadProducts();
    } catch (e: any) {
      toast.update(id, { render: "Giao dịch thất bại hoặc bị từ chối", type: "error", isLoading: false, autoClose: 5000 });
      console.error(e);
    }
    setLoading(false);
  }

  // Xử lý bộ lọc tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().includes(searchTerm)
  );

  return (
    <main style={{ padding: "20px", color: "black", backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: 'sans-serif' }}>
      {/* Container cho thông báo */}
      <ToastContainer position="top-right" theme="colored" />

      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#0070f3" }}>🚀 Hệ Thống Truy Xuất Web3</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            value={formData.name}
            placeholder="📦 Tên sản phẩm (VD: Chuối Sanzo)" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: '16px' }} 
          />
          <input 
            value={formData.desc}
            placeholder="📝 Mô tả chi tiết" 
            onChange={e => setFormData({...formData, desc: e.target.value})} 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: '16px' }} 
          />
          <input 
            value={formData.loc}
            placeholder="📍 Vị trí/Nguồn gốc (VD: Gia Lai, VN)" 
            onChange={e => setFormData({...formData, loc: e.target.value})} 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: '16px' }} 
          />
          <button 
            onClick={addProduct} 
            disabled={loading} 
            style={{ 
              padding: "15px", 
              background: loading ? "#ccc" : "linear-gradient(45deg, #0070f3, #00a1ff)", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: '16px',
              transition: '0.3s'
            }}
          >
            {loading ? "⌛ ĐANG XỬ LÝ..." : "🔗 ĐƯA LÊN BLOCKCHAIN"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "40px auto" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>📋 Nhật ký sản phẩm</h3>
          
          {/* Thanh tìm kiếm */}
          <input 
            type="text"
            placeholder="🔍 Tìm theo tên hoặc ID..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', minWidth: '250px' }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', gridColumn: '1/-1' }}>Không tìm thấy sản phẩm nào.</p>
          ) : filteredProducts.map((p, index) => (
            <div key={index} style={{ background: "white", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderLeft: '5px solid #0070f3' }}>
              <div style={{ flex: 1 }}>
                <span style={{ background: '#eef5ff', color: '#0070f3', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  ID: #{p.id.toString()}
                </span>
                <h4 style={{ margin: "10px 0 5px 0", color: '#111' }}>{p.name}</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: '14px', color: '#666' }}>{p.description}</p>
                <p style={{ margin: "5px 0", fontSize: '14px' }}>📍 <strong>Gốc:</strong> {p.location}</p>
                <small style={{ color: "#999", fontSize: '12px' }}>⏰ {new Date(Number(p.timestamp) * 1000).toLocaleString()}</small>
              </div>
              
              <div style={{ textAlign: "center", marginLeft: "20px" }}>
                {/* QR dẫn tới Etherscan để kiểm tra minh bạch công khai */}
                <QRCodeSVG 
                  value={`https://sepolia.etherscan.io/address/${contractAddress}`} 
                  size={90}
                  level="H"
                  includeMargin={true}
                />
                <p style={{ fontSize: "10px", marginTop: "5px", color: "#0070f3", fontWeight: 'bold' }}>QUÉT MINH BẠCH</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}