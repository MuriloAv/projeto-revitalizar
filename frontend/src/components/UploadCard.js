import React from 'react';
import './UploadCard.css'; // Vamos criar este arquivo CSS

function UploadCard({ upload }) {
  // O backend (idealmente) nos envia os dados 'user' e 'residue_type' já aninhados
  const { image_url, user, residue_type, collected_at } = upload;

  return (
    <div className="card">
      <img src={image_url} alt={residue_type.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{residue_type.name}</h3>
        <p><strong>Categoria:</strong> {residue_type.category}</p>
        <p><strong>Decomposição:</strong> {residue_type.decomposition_time}</p>
        <p><strong>Coletado por:</strong> {user.email}</p>
        <p><strong>Data:</strong> {new Date(collected_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}

export default UploadCard;