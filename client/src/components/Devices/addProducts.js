import React, { useState } from 'react';

const AddProduct = (props) => {
  const [form, setForm] = useState({
    genre: '',
    name: '',
    maker: '',
    serialNumber: '',
    accessories: '',
    purchase: {
      date: '',
      place: '',
      price: '',
    },
    remarks: '',
  });
  return (
    <div>
      <p>機材を登録します。</p>
      <div>
        <form>
          <select
            className="nk nk_select"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          >
            <option value="">ジャンルを選択してください</option>
            <option value="broadcast">放送配信</option>
            <option value="pa">会場音響</option>
            <option value="venue-supplies">会場整備</option>
            <option value="pr">広報</option>
            <option value="oa">事務</option>
            <option value="transpotation">運搬用品</option>
            <option value="other">その他</option>
          </select>
          <input
            type="text"
            className="nk nk_input"
            placeholder="製品名"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="メーカー"
            value={form.maker}
            onChange={(e) => setForm({ ...form, maker: e.target.value })}
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="シリアルナンバー"
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="付属品"
            value={form.accessories}
            onChange={(e) => setForm({ ...form, accessories: e.target.value })}
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="購入日"
            value={form.purchase.date}
            onChange={(e) =>
              setForm({
                ...form,
                purchase: { ...form.purchase, date: e.target.value },
              })
            }
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="購入場所"
            value={form.purchase.place}
            onChange={(e) =>
              setForm({
                ...form,
                purchase: { ...form.purchase, place: e.target.value },
              })
            }
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="購入価格"
            value={form.purchase.price}
            onChange={(e) =>
              setForm({
                ...form,
                purchase: { ...form.purchase, price: e.target.value },
              })
            }
          />
          <input
            type="text"
            className="nk nk_input"
            placeholder="特記事項"
            onChange={(e) =>
              setForm({
                ...form,
                remarks: e.target.value,
              })
            }
          />

          <button type="button" className="nk nk_button">
            登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;