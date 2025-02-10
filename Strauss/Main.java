import java.util.HashMap;
import java.util.Map;

class Conta {
    private String nome;
    private String cpf;
    private double saldo;

    public Conta(String nome, String cpf, double saldoInicial) {
        this.nome = nome;
        this.cpf = cpf;
        this.saldo = saldoInicial;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public double getSaldo() {
        return saldo;
    }

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            System.out.println("Depósito de R$" + valor + " realizado com sucesso.");
        } else {
            System.out.println("Valor de depósito inválido.");
        }
    }

    public boolean sacar(double valor) {
        if (valor > 0 && saldo >= valor) {
            saldo -= valor;
            System.out.println("Saque de R$" + valor + " realizado com sucesso.");
            return true;
        } else {
            System.out.println("Saldo insuficiente ou valor de saque inválido.");
            return false;
        }
    }

    public void transferir(Conta destino, double valor) {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            System.out.println("Transferência de R$" + valor + " para " + destino.getNome() + " realizada com sucesso.");
        } else {
            System.out.println("Transferência falhou.");
        }
    }

    public String toString() {
        return "Conta{" +
                "nome='" + nome + '\'' +
                ", cpf='" + cpf + '\'' +
                ", saldo=" + saldo +
                '}';
    }
}

class Banco {
    private Map<String, Conta> contas;

    public Banco() {
        contas = new HashMap<>();
    }

    public void criarConta(String nome, String cpf, double saldoInicial) {
        if (!contas.containsKey(cpf)) {
            Conta novaConta = new Conta(nome, cpf, saldoInicial);
            contas.put(cpf, novaConta);
            System.out.println("Conta criada com sucesso para " + nome + ".");
        } else {
            System.out.println("Já existe uma conta com este CPF.");
        }
    }

    public Conta getConta(String cpf) {
        return contas.get(cpf);
    }

    public void listarContas() {
        for (Conta conta : contas.values()) {
            System.out.println(conta);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Banco banco = new Banco();

        banco.criarConta("João Silva", "123.456.789-00", 1000.0);
        banco.criarConta("Maria Oliveira", "987.654.321-00", 500.0);

        banco.listarContas();

        Conta joao = banco.getConta("123.456.789-00");
        Conta maria = banco.getConta("987.654.321-00");

        if (joao != null && maria != null) {
            joao.depositar(200.0);
            joao.transferir(maria, 300.0);
        }

        banco.listarContas();
    }
}