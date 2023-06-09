import { useState, useEffect } from "react";

export default function usePedido(id) {
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);

  const fetchPedido = async () => {
    setLoading(true);

    try {
      const responsePedido = await fetch(
        `https://sistemalift1.com/lift_ps/api/Pedidos/${id}`
      );
      const responseCliente = await fetch(
        `https://sistemalift1.com/lift_ps/api/Clientes/`
      );
      const responseItensPedido = await fetch(
        `https://sistemalift1.com/lift_ps/api/ItensPedido/${id}`
      );
      const responseProdutos = await fetch(
        `https://sistemalift1.com/lift_ps/api/Produtos`
      );

      const pedido = await responsePedido.json();
      const clientes = await responseCliente.json();
      const itensPedido = await responseItensPedido.json();
      const produtos = await responseProdutos.json();

      const cliente = clientes.find(
        (cliente) => cliente?.id === pedido?.cliente
      );

      const itens = itensPedido.map((item) => {
        const produto = produtos.find(
          (produto) => produto?.id === item?.produto
        );
        return {
          ...item,
          produtoNome: produto?.nome,
        };
      });

      setPedido(pedido);
      setCliente(cliente);
      setItensPedido(itens);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedido();
  }, []);

  return {
    pedido,
    cliente,
    itensPedido,
    loading,
  };
}
