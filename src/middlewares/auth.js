export function verificarAutenticacao(req, res, next) {
    // Impede que o navegador guarde a página no cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    if (req.session.userId) {
        return next(); // Está logado, pode prosseguir
    }
    res.redirect('/login'); // Não está logado, vai para o login
}

export function verificarAdm(req, res, next) {
    if (req.session.userId && req.session.adm === true) {
        return next();
    }
    res.status(403).json({ message: "Acesso negado. Apenas administradores podem fazer isso." });
}

